import sys
from collections import deque, defaultdict
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

def parsing_expression_to_formula_conflicts(expression_string):
    if not expression_string:
        return 0
    try:
        after_and_split = expression_string.split(",")
        return Or(*substrings_to_symbols(after_and_split))
    except Exception as e:
        print(f"Error parsing expression: {e}")
        return 0

def check_depends(formula):
    if formula:
        return And(formula, TRUE())
    return 0

def check_conflict(formula):
    if formula:
#         print(formula)
        # Convert to Or and then negate to properly represent conflicts
        return Not(formula)
    return 0
def build_package_formula(package_name, depends_formula, conflicts_formula):
    if depends_formula == 0 and conflicts_formula == 0:
        return Implies(symbol_exist(package_name), TRUE())
    elif conflicts_formula == 0:
        return Implies(symbol_exist(package_name), depends_formula)
    elif depends_formula == 0:
        return Implies(symbol_exist(package_name), conflicts_formula)
    else:
        # Combine depends and conflicts correctly
        return Implies(symbol_exist(package_name), And(depends_formula, conflicts_formula))

def from_package_to_formula(packages, install_packages):
    # Process and add package formulas
    for package_name, package_info in packages.items():
        depends_formula = check_depends(parsing_expression_to_formula(package_info["Depends"]))
        conflicts_formula = check_conflict(parsing_expression_to_formula_conflicts(package_info["Conflicts"]))
        package_formula = build_package_formula(package_name, depends_formula, conflicts_formula)
        solver.add_assertion(package_formula)
        packages_info[package_name] = package_info

    # Process installation packages
    install_packages['val'] = install_packages['val'].replace(' ', '')
    install_formula = parsing_expression_to_formula(install_packages['val'])
    solver.add_assertion(install_formula)


def open_and_parse_file(file_path, install_package):
    packages = {}
    try:
        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line.startswith("Package:"):
                    current_package_name = line.split(':')[1].strip()
                    packages[current_package_name] = {"Depends": "", "Conflicts": ""}
                elif line.startswith("Depends:"):
                    packages[current_package_name]["Depends"] = line.split(':')[1].strip()
                elif line.startswith("Conflicts:"):
                    packages[current_package_name]["Conflicts"] = line.split(':')[1].strip()
                elif line.startswith("Install:"):
                    install_package['val'] = line.split(':')[1].strip()
        return packages
    except Exception as e:
        print(f"Error reading file: {e}")
        return {}


def extract_installation_plan(model, install_packages):
    package_string = install_packages.get('val', '')
    and_groups = package_string.split(',')
    result = []
    for group in and_groups:
        or_packages = group.split('|')
        found = False
        for package in or_packages:
            package = package.strip()
            value = model.get_value(symbol_exist(package))
            if value == TRUE():
                result.append(package)
                found = True
                break
    return result

def print_installation_plan(required_packages):
    print("Installation plan with required dependencies:")
    for package in required_packages:
        print(package)

def insert_blocking_model(selected_packages):
    # Insert all symbol into list
    symbols = [symbol_exist(package) for package in selected_packages]
    # Create expression of ands between all symbols of current solution
    andExpression = And(symbols)
    # Wrap the and expression with Not in order for not using the same solution again
    notAndExpression = Not(andExpression)
    # Add the new assertion for the solver
    solver.add_assertion(notAndExpression)

if __name__ == '__main__':
    install_packages = {}
    packages = open_and_parse_file(sys.argv[1], install_packages)
    from_package_to_formula(packages, install_packages)
    is_sat = solver.solve()
    while is_sat:
        model = solver.get_model()
        required_packages = set(extract_installation_plan(model, install_packages))
        print_installation_plan(required_packages)
        insert_blocking_model(required_packages)
        is_sat = solver.solve()
    else:
        print("There is no installation plan")
