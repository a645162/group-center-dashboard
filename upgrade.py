import os

os.system("ncu -u")
os.system("bun i")
os.system("pnpm i")
os.system("bun i")
os.system("bun format")
os.system("bun build")

# chore(Lib): Bump lib version
