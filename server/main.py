import sys
from collections import deque
from pysmt.shortcuts import Implies, Solver, And, Or, Not, Symbol, TRUE, FALSE

solver = Solver(name="z3")
symbols = {}
packages_info = {}  # Store package dependencies and conflicts

def symbol_exist(symbol_name):
    if symbol_name not in symbols:
        symbols[symbol_name] = Symbol(symbol_name)
    return symbols[symbol_name]

def build_or_from_list(symbol_list):
    return Or([symbol_exist(name) for name in symbol_list])

def substrings_to_symbols(string_list):
    symbols_list = []
    for sub_string in string_list:
        after_or_split = sub_string.split("|")
        if len(after_or_split) > 1:
            symbols_list.append(build_or_from_list(after_or_split))
        else:
            symbols_list.append(symbol_exist(after_or_split[0]))
    return symbols_list

def parsing_expression_to_formula(expression_string):
    if not expression_string:
        return 0
    try:
        after_and_split = expression_string.split(",")
        return And(*substrings_to_symbols(after_and_split), TRUE())
    except Exception as e:
        print(f"Error parsing expression: {e}")
        return 0

def check_depends(formula):
    if formula:
        return And(formula, TRUE())
    return 0

def check_conflict(formula):
    if formula:
        return Not(Or(formula, FALSE()))
    return 0

def build_package_formula(package_name, depends_formula, conflicts_formula):
    if depends_formula == 0 and conflicts_formula == 0:
        return Implies(symbol_exist(package_name), TRUE())
    elif conflicts_formula == 0:
        return Implies(symbol_exist(package_name), depends_formula)
    elif depends_formula == 0:
        return Implies(symbol_exist(package_name), conflicts_formula)
    else:
        return Implies(symbol_exist(package_name), And(depends_formula, conflicts_formula))

def from_package_to_formula(packages, install_packages):
    for package_name, package_info in packages.items():
        depends_formula = check_depends(parsing_expression_to_formula(package_info["Depends"]))
        conflicts_formula = check_conflict(parsing_expression_to_formula(package_info["Conflicts"]))
        package_formula = build_package_formula(package_name, depends_formula, conflicts_formula)
        solver.add_assertion(package_formula)
        packages_info[package_name] = package_info

    for package in install_packages:
        install_formula = symbol_exist(package)
        solver.add_assertion(install_formula)

def open_and_parse_file(file_path, install_package):
    packages = {}
    try:
        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line.startswith("Package:"):
                    current_package_name = line.split(':')[1]
                    packages[current_package_name] = {"Depends": "", "Conflicts": ""}
                elif line.startswith("Depends:"):
                    packages[current_package_name]["Depends"] = line.split(':')[1]
                elif line.startswith("Conflicts:"):
                    packages[current_package_name]["Conflicts"] = line.split(':')[1]
                elif line.startswith("Install:"):
                    install_package.extend(line.split(':')[1].split(','))
        return packages
    except Exception as e:
        print(f"Error reading file: {e}")
        return {}

def extract_installation_plan(model, install_packages):
    return [name for name in install_packages if model.get_value(symbol_exist(name)) == TRUE()]

def bfs_dependencies(start_packages):
    visited = set()
    queue = deque(start_packages)
    required_packages = set(start_packages)

    while queue:
        current_package = queue.popleft()
        if current_package not in visited:
            visited.add(current_package)
            if current_package in packages_info:
                package_info = packages_info[current_package]
                depends = package_info.get("Depends", "").split(",")
                for dep in depends:
                    dep = dep.strip()
                    if dep and dep not in visited:
                        required_packages.add(dep)
                        queue.append(dep)

    return required_packages

def print_installation_plan(required_packages):
    print("Installation plan with required dependencies:")
    for package in required_packages:
        print(package)

if __name__ == '__main__':
    install_packages = []
    packages = open_and_parse_file(sys.argv[1], install_packages)
    from_package_to_formula(packages, install_packages)
    is_sat = solver.solve()
    if is_sat:
        model = solver.get_model()
        installation_plan = extract_installation_plan(model, install_packages)
        required_packages = bfs_dependencies(installation_plan)
        print_installation_plan(required_packages)
    else:
        print("There is no installation plan")








