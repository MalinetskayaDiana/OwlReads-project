import os

# 1. Укажите путь к вашему проекту мобильного приложения (React Native)
project_root = r"D:\BSUIR\Diploma\OwlReads-project\mobile-OwlReads"
# 2. Имя выходного файла
output_file = "react_native_code_dump.txt"

# Расширения файлов, которые нам интересны
include_ext = {".js", ".jsx", ".ts", ".tsx", ".json"}
# Папки, которые нужно пропустить (обязательно node_modules, так как она весит гигабайты)
exclude_dirs = {
    "node_modules",
    ".git",
    "android",
    "ios",
    ".expo",
    ".expo-shared",
    "assets",
    "build",
    "dist",
    "__pycache__"
}


def dump_project():
    count = 0
    with open(output_file, "w", encoding="utf-8") as out:
        for root, dirs, files in os.walk(project_root):
            # Фильтруем папки-исключения
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in include_ext:
                    # Пропускаем тяжелые файлы конфигурации, если они не нужны (опционально)
                    if file in ["package-lock.json", "yarn.lock"]:
                        continue

                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, project_root)

                    out.write(f"\n\n===== FILE: {relative_path} =====\n\n")
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            out.write(f.read())
                        count += 1
                    except Exception as e:
                        out.write(f"[Ошибка чтения файла: {e}]")

    print(f"Успешно! Собрано файлов: {count}")
    print(f"Результат сохранен в: {os.path.abspath(output_file)}")


if __name__ == "__main__":
    dump_project()