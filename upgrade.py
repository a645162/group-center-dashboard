import os

os.system("bun run ncu -u")
os.system("bun i")

ret=os.system("bun run build")
if ret != 0:
    exit(ret)

os.system("pnpm i")
os.system("bun i")
os.system("bun run format")

# chore(Lib): Bump lib version
