import os

target_dir = "/Users/huangguanhong/Documents/HGH design project /2026-04-02-AI tool practice/MJ casa/src"

for root, dirs, files in os.walk(target_dir):
    for filename in files:
        if filename.endswith(".tsx") or filename.endswith(".css"):
            filepath = os.path.join(root, filename)
            with open(filepath, "r") as f:
                content = f.read()
            if "text-[10px]" in content:
                content = content.replace("text-[10px]", "text-xs")
                with open(filepath, "w") as f:
                    f.write(content)
                print(f"Updated text-[10px] in {filepath}")

# Update index.css
css_path = os.path.join(target_dir, "index.css")
with open(css_path, "r") as f:
    css = f.read()

# Make muted text lighter
css = css.replace("--color-mj-muted: #888888;", "--color-mj-muted: #c4c4c4;")
# Increase general small text contrast
css = css.replace("rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.1)")

with open(css_path, "w") as f:
    f.write(css)

