import os
import shutil


def remove_node_modules():
    node_module_path = os.path.join(os.getcwd(), "node_modules")
    if os.path.exists(node_module_path):
        # Remove
        shutil.rmtree(node_module_path)

def update(without_regex=""):
    if without_regex:
        os.system(f"bun run ncu -x \"{without_regex}\" -u")
        
        # bun run ncu -f "/tailwindcss/" -t minor -u
        os.system(f"bun run ncu -f \"{without_regex}\" -t minor -u")
    else:
        os.system("bun run ncu -u")

# Install dependencies
os.system("bun i")
# Upgrade dependencies
update("/tailwindcss/")
# os.system('bun run ncu -x "/tailwindcss/" -u')
# os.system('bun run ncu -f "/tailwindcss/" -t minor -u')
# Reinstall dependencies
os.system("bun i")

# Build Test
ret = os.system("bun run build")
if ret != 0:
    exit(ret)

# Remove node_modules before running pnpm install
remove_node_modules()
os.system("pnpm i")

os.system("bun i")
os.system("bun run format")

# chore(Lib): Bump lib version
