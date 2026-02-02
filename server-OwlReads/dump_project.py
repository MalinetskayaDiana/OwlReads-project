import os

project_root = r"D:\BSUIR\Diploma\OwlReads-project\server-OwlReads"
output_dir = "project_dump_parts"

include_ext = {".py", ".yml", ".yaml", ".env", ".txt", ".md"}
exclude_dirs = {"__pycache__", ".venv", ".idea"}

os.makedirs(output_dir, exist_ok=True)

for root, dirs, files in os.walk(project_root):
    # пропускаем служебные папки
    dirs[:] = [d for d in dirs if d not in exclude_dirs]

    # имя файла для дампа этой папки
    relative_path = os.path.relpath(root, project_root)
    safe_name = relative_path.replace("\\", "_").replace("/", "_")
    if safe_name == ".":
        safe_name = "root"
    output_file = os.path.join(output_dir, f"{safe_name}.txt")

    with open(output_file, "w", encoding="utf-8") as out:
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in include_ext:
                file_path = os.path.join(root, file)
                out.write(f"\n\n===== {file_path} =====\n\n")
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        out.write(f.read())
                except Exception as e:
                    out.write(f"[Ошибка чтения файла: {e}]")