import sys


from pysmt.shortcuts import Implies, Solver, And, Or, Not, BOOL, Symbol, TRUE ,FALSE
solver = Solver(name="z3")
symbols = {}

## key in dictonray are set or not

## checking if symbol is exist inorder to dont create duplicates from the same variables
def symbol_exist(symbol_name):
    result = symbols.get(symbol_name, 0)
    if not result:
        symbols[symbol_name] = Symbol(symbol_name)
    return symbols[symbol_name]


##creating final formula: package -> (depends & ~conflict)]
def build_package_formula(package_name,depends_formula,conflicts_formula):

    ## if depends and conflict empty
    if conflicts_formula == 0 and depends_formula == 0:
        return Implies(symbol_exist(package_name), TRUE())
    ## if no conflicts
    elif conflicts_formula == 0:
        return Implies(symbol_exist(package_name), depends_formula)
    ## if no depends
    elif depends_formula == 0:
        return Implies(symbol_exist(package_name),conflicts_formula)
    ## if depends and conflicts exist
    else:
        return Implies(symbol_exist(package_name), And(depends_formula, conflicts_formula))

## input is list of strings the together creating OR operand : string1 | string2 ... -> creating Or object
def build_or_from_list(list):
    or_formula = []
    for symbol_name in list:
        or_formula.append(symbol_exist(symbol_name))
        ## Or between all or_symboles
    return Or(or_formula)


def substrings_to_symbols(symbols_list,string_list):
    for sub_string in string_list:
        after_or_split = sub_string.split("|")
        ## if there is | opretor in specific substring
        if (len(after_or_split) > 1):
            symbols_list.append(build_or_from_list(after_or_split))
        ## if there isnt  | opretor in specific substring
        else:
            symbols_list.append(symbol_exist(after_or_split[0]))
    return symbols_list




## taking expression and converting in to formula by Pysmt Objects: Symbol , Or , And
def parsing_expression_to_formula(expression_string):
    symbols_list = []
    if expression_string == "":
        return 0
    after_and_split = expression_string.split(",")
    formula = substrings_to_symbols(symbols_list, after_and_split)
    return formula

def check_depends(formula):
    if not formula:
        return 0
    return And(*formula,TRUE())

def chech_conflict(formula):
    if not formula:
        return 0
    return Not(Or(*formula, FALSE()))

##packages = {"java":{"Depends":"","Conflicts":"spring"} , "apt":{"Depends":[],"Conflicts":[]}}

def from_packge_to_formula(packages,install_packages):
    for package_name, package_info in packages.items():
       depends_formula = check_depends(parsing_expression_to_formula(package_info["Depends"]))
       conflicts_formula = chech_conflict(parsing_expression_to_formula(package_info["Conflicts"]))
       package_formula = build_package_formula(package_name, depends_formula, conflicts_formula)
       solver.add_assertion(package_formula)

    for package in install_packages:
        install_formula = symbol_exist(package)
        solver.add_assertion(And(install_formula))



def open_and_parsing_file(file_path,install_package):
    packeges = {}
    try:
        with open(file_path,'r') as file:
            for line in file:
                    line = line.replace(" ", "").replace("\n","")
                    if line.startswith("Package:"):
                        current_package_name = line.split(':')[1]
                        packeges[current_package_name] = {"Depends":"","Conflicts":""}
                    if line.startswith("Depends:"):
                        packeges[current_package_name]["Depends"] = line.split(':')[1]
                    if line.startswith("Conflicts:"):
                        packeges[current_package_name]["Conflicts"] = line.split(':')[1]
                    if line.startswith("Install:"):
                        install_package.extend(line.split(':')[1].split(','))
        return packeges


    except:
        print("path is not valid")


def print_victory():
    print("There is an installation plan:")
    model = solver.get_model()
    for symbol_name, symbol in symbols.items():
        if model.get_value(symbol) == TRUE():
            print(symbol_name)


if __name__ == '__main__':
    install_packages = []
    packages = open_and_parsing_file(sys.argv[1],install_packages)
    from_packge_to_formula(packages,install_packages)
    if solver.solve():
        print_victory()
    else:
        print("There is no installation plan")
