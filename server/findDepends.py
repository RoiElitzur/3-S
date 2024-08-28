import sys
from collections import deque

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
        return packages, install_package
    except Exception as e:
        print(f"Error reading file: {e}")
        return {}


def bfs_dependencies(packages, plan):
    stripPlan = {item.strip() for item in plan}
    planSet = set(stripPlan)
    visited = set()
    queue = deque(plan)
    required_packages = set()

    while queue:
        current_package = queue.popleft()
        if current_package not in visited:
            visited.add(current_package)
            if current_package in packages:
                package_info = packages[current_package]
                depends = package_info.get("Depends", "").split(",")
                for dep in depends:
                    dep = dep.strip()
                    if dep and (dep not in visited) and (dep not in planSet):
                        print(dep)
                        required_packages.add(dep)
                        queue.append(dep)

    return required_packages

def print_installation_plan(required_packages):
    print("dependencies:")
    for package in required_packages:
        print(package)


if __name__ == '__main__':
    install_packages = []
    packages, plan = open_and_parse_file(sys.argv[1], install_packages)
    required_packages = bfs_dependencies(packages, plan)
    print_installation_plan(required_packages)
