# import sys
# from collections import deque
# from pysmt.shortcuts import Implies, Solver, And, Or, Not, Symbol, TRUE, FALSE
#
# solver = Solver(name="z3")
# symbols = {}
# packages_info = {}  # Store package dependencies and conflicts
#
# def symbol_exist(symbol_name):
#     if symbol_name not in symbols:
#         symbols[symbol_name] = Symbol(symbol_name)
#     return symbols[symbol_name]
#
# def build_or_from_list(symbol_list):
#     return Or([symbol_exist(name) for name in symbol_list])
#
# def substrings_to_symbols(string_list):
#     symbols_list = []
#     for sub_string in string_list:
#         after_or_split = sub_string.split("|")
#         if len(after_or_split) > 1:
#             symbols_list.append(build_or_from_list(after_or_split))
#         else:
#             symbols_list.append(symbol_exist(after_or_split[0]))
#     return symbols_list
#
# def parsing_expression_to_formula(expression_string):
#     if not expression_string:
#         return 0
#     try:
#         after_and_split = expression_string.split(",")
#         return And(*substrings_to_symbols(after_and_split), TRUE())
#     except Exception as e:
#         print(f"Error parsing expression: {e}")
#         return 0
#
# def check_depends(formula):
#     if formula:
#         return And(formula, TRUE())
#     return 0
#
# def check_conflict(formula):
#     if formula:
#         return Not(Or(formula, FALSE()))
#     return 0
#
# def build_package_formula(package_name, depends_formula, conflicts_formula):
#     if depends_formula == 0 and conflicts_formula == 0:
#         return Implies(symbol_exist(package_name), TRUE())
#     elif conflicts_formula == 0:
#         return Implies(symbol_exist(package_name), depends_formula)
#     elif depends_formula == 0:
#         return Implies(symbol_exist(package_name), conflicts_formula)
#     else:
#         return Implies(symbol_exist(package_name), And(depends_formula, conflicts_formula))
#
# def from_package_to_formula(packages, install_packages):
#     for package_name, package_info in packages.items():
#         depends_formula = check_depends(parsing_expression_to_formula(package_info["Depends"]))
#         conflicts_formula = check_conflict(parsing_expression_to_formula(package_info["Conflicts"]))
#         package_formula = build_package_formula(package_name, depends_formula, conflicts_formula)
#         solver.add_assertion(package_formula)
#         packages_info[package_name] = package_info
#
#     for package in install_packages:
#         install_formula = symbol_exist(package)
#         solver.add_assertion(install_formula)
#
# def open_and_parse_file(file_path, install_package):
#     packages = {}
#     try:
#         with open(file_path, 'r') as file:
#             for line in file:
#                 line = line.strip()
#                 if line.startswith("Package:"):
#                     current_package_name = line.split(':')[1]
#                     packages[current_package_name] = {"Depends": "", "Conflicts": ""}
#                 elif line.startswith("Depends:"):
#                     packages[current_package_name]["Depends"] = line.split(':')[1]
#                 elif line.startswith("Conflicts:"):
#                     packages[current_package_name]["Conflicts"] = line.split(':')[1]
#                 elif line.startswith("Install:"):
#                     install_package.extend(line.split(':')[1].split(','))
#         return packages
#     except Exception as e:
#         print(f"Error reading file: {e}")
#         return {}
#
# def extract_installation_plan(model, install_packages):
#     return [name for name in install_packages if model.get_value(symbol_exist(name)) == TRUE()]
#
# def bfs_dependencies(start_packages):
#     visited = set()
#     queue = deque(start_packages)
#     required_packages = set(start_packages)
#
#     while queue:
#         current_package = queue.popleft()
#         if current_package not in visited:
#             visited.add(current_package)
#             if current_package in packages_info:
#                 package_info = packages_info[current_package]
#                 depends = package_info.get("Depends", "").split(",")
#                 for dep in depends:
#                     dep = dep.strip()
#                     if dep and dep not in visited:
#                         required_packages.add(dep)
#                         queue.append(dep)
#
#     return required_packages
#
# def print_installation_plan(required_packages):
#     print("Installation plan with required dependencies:")
#     for package in required_packages:
#         print(package)
#
# if __name__ == '__main__':
#     install_packages = []
#     packages = open_and_parse_file(sys.argv[1], install_packages)
#     from_package_to_formula(packages, install_packages)
#     is_sat = solver.solve()
#     if is_sat:
#         model = solver.get_model()
#         installation_plan = extract_installation_plan(model, install_packages)
#         required_packages = bfs_dependencies(installation_plan)
#         print_installation_plan(required_packages)
#     else:
#         print("There is no installation plan")



















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
#         print(package_formula)
        solver.add_assertion(package_formula)
        packages_info[package_name] = package_info

    # Process installation packages
    install_packages['val'] = install_packages['val'].replace(' ', '')
    install_formula = parsing_expression_to_formula(install_packages['val'])
#     print(install_formula)
#     print(f"Install Formula: {install_formula}")  # Debug print statement
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

# def extract_installation_plan(model, install_packages):
#     return [name for name in install_packages if model.get_value(symbol_exist(name)) == TRUE()]
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

def insert_blocking_model(selected_packages):
    # Create a list of Not(symbol) for each package that was selected in the current solution
    blocking_clauses = [Not(symbol_exist(package)) for package in selected_packages]
    # Add the blocking clause to the solver to block the current solution
    solver.add_assertion(Or(blocking_clauses))

if __name__ == '__main__':
    install_packages = {}
    packages = open_and_parse_file(sys.argv[1], install_packages)
    from_package_to_formula(packages, install_packages)
#     print("Assertions in the solver:")
#     for assertion in solver.assertions:
#         print(assertion.serialize())
    is_sat = solver.solve()
    while is_sat:
        model = solver.get_model()
        installation_plan = extract_installation_plan(model, install_packages)
        required_packages = bfs_dependencies(installation_plan)
        print_installation_plan(required_packages)
        insert_blocking_model(required_packages)
        is_sat = solver.solve()
    else:
        print("There is no installation plan")

#
# import sys
# from collections import deque
# from pysmt.shortcuts import Implies, Solver, And, Or, Not, Symbol, TRUE, FALSE
#
# solver = Solver(name="z3")
# symbols = {}
# packages_info = {}  # Store package dependencies and conflicts
#
# def symbol_exist(symbol_name):
#     if symbol_name not in symbols:
#         symbols[symbol_name] = Symbol(symbol_name)
#     return symbols[symbol_name]
#
# def build_or_from_list(symbol_list):
#     return Or([symbol_exist(name) for name in symbol_list])
#
# def substrings_to_symbols(string_list):
#     symbols_list = []
#     for sub_string in string_list:
#         after_or_split = sub_string.split("|")
#         if len(after_or_split) > 1:
#             symbols_list.append(build_or_from_list(after_or_split))
#         else:
#             symbols_list.append(symbol_exist(after_or_split[0]))
#     return symbols_list
#
# def parsing_expression_to_formula(expression_string):
#     if not expression_string:
#         return 0
#     try:
#         after_and_split = expression_string.split(",")
#         return And(*substrings_to_symbols(after_and_split), TRUE())
#     except Exception as e:
#         print(f"Error parsing expression: {e}")
#         return 0
#
# def check_depends(formula):
#     if formula:
#         return And(formula, TRUE())
#     return 0
#
# def check_conflict(formula):
#     if formula:
#         return Not(Or(formula, FALSE()))
#     return 0
#
# def build_package_formula(package_name, depends_formula, conflicts_formula):
#     if depends_formula == 0 and conflicts_formula == 0:
#         return Implies(symbol_exist(package_name), TRUE())
#     elif conflicts_formula == 0:
#         return Implies(symbol_exist(package_name), depends_formula)
#     elif depends_formula == 0:
#         return Implies(symbol_exist(package_name), conflicts_formula)
#     else:
#         return Implies(symbol_exist(package_name), And(depends_formula, conflicts_formula))
#
# def from_package_to_formula(packages, install_packages):
#     for package_name, package_info in packages.items():
#         depends_formula = check_depends(parsing_expression_to_formula(package_info["Depends"]))
#         conflicts_formula = check_conflict(parsing_expression_to_formula(package_info["Conflicts"]))
#         package_formula = build_package_formula(package_name, depends_formula, conflicts_formula)
#         solver.add_assertion(package_formula)
#         packages_info[package_name] = package_info
#
#     install_packages['val'] = install_packages['val'].replace(' ', '')
#     install_formula = parsing_expression_to_formula(install_packages['val'])
#     print(f"Install Formula: {install_formula}")  # Debug print statement
#     solver.add_assertion(install_formula)
#
# def open_and_parse_file(file_path, install_package):
#     packages = {}
#     try:
#         with open(file_path, 'r') as file:
#             for line in file:
#                 line = line.strip()
#                 if line.startswith("Package:"):
#                     current_package_name = line.split(':')[1].strip()
#                     packages[current_package_name] = {"Depends": "", "Conflicts": ""}
#                 elif line.startswith("Depends:"):
#                     packages[current_package_name]["Depends"] = line.split(':')[1].strip()
#                 elif line.startswith("Conflicts:"):
#                     packages[current_package_name]["Conflicts"] = line.split(':')[1].strip()
#                 elif line.startswith("Install:"):
#                     install_package['val'] = line.split(':')[1].strip()
#         return packages
#     except Exception as e:
#         print(f"Error reading file: {e}")
#         return {}
#
# def extract_installation_plan(model, install_packages):
#     package_string = install_packages.get('val', '')
#     and_groups = package_string.split(',')
#     result = []
#     for group in and_groups:
#         or_packages = group.split('|')
#         found = False
#         for package in or_packages:
#             package = package.strip()
#             value = model.get_value(symbol_exist(package))
#             if value == TRUE():
#                 result.append(package)
#                 found = True
#                 break
#     return result
#
# def bfs_dependencies(start_packages):
#     visited = set()
#     queue = deque(start_packages)
#     required_packages = set(start_packages)
#
#     while queue:
#         current_package = queue.popleft()
#         if current_package not in visited:
#             visited.add(current_package)
#             if current_package in packages_info:
#                 package_info = packages_info[current_package]
#                 depends = package_info.get("Depends", "").split(",")
#                 for dep in depends:
#                     dep = dep.strip()
#                     if dep and dep not in visited:
#                         required_packages.add(dep)
#                         queue.append(dep)
#
#     return required_packages
#
# def print_installation_plan(required_packages):
#     print("Installation plan with required dependencies:")
#     for package in required_packages:
#         print(package)
#
# def try_all_solutions(install_packages, initial_model):
#     # To keep track of solutions
#     counter = 0
#     max_solutions = 10
#     all_solutions = []
#
#     # Keep the initial state
#     solver.push()
#
#     for package_group in install_packages['val'].split(','):
#         or_packages = package_group.split('|')
#         for package in or_packages:
#             package = package.strip()
#
#             # Check the current package in the model
#             value = initial_model.get_value(symbol_exist(package))
#             if value == TRUE():
#                 print(f"Trying package {package} as true and blocking other options...")
#
#                 # Add assertion for the current package and try to solve
#                 solver.add_assertion(Not(symbol_exist(package))
#                 is_sat = solver.solve()
#
#                 if is_sat:
#                     model = solver.get_model()
#                     installation_plan = extract_installation_plan(model, install_packages)
#                     required_packages = bfs_dependencies(installation_plan)
#                     all_solutions.append(required_packages)
#
#                     counter += 1
#                     if counter >= max_solutions:
#                         print("Maximum number of solutions found.")
#                         break
#
#                 # Remove the current package assertion to try other options
#                 solver.pop()
#
#                 # If we've found enough solutions, break the loop
#                 if counter >= max_solutions:
#                     break
#         if counter >= max_solutions:
#             break
#
#     return all_solutions
#
# if __name__ == '__main__':
#     install_packages = {}
#     packages = open_and_parse_file(sys.argv[1], install_packages)
#     from_package_to_formula(packages, install_packages)
#     initial_model = None
#     is_sat = solver.solve()
#
#     if is_sat:
#         initial_model = solver.get_model()
#         all_solutions = try_all_solutions(install_packages, initial_model)
#         for i, solution in enumerate(all_solutions):
#             print(f"Solution {i+1}:")
#             print_installation_plan(solution)
#     else:
#         print("There is no installation plan")
