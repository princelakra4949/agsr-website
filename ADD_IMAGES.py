"""
╔══════════════════════════════════════════════════════════╗
║        AGSR SONIPAT — Image Setup Helper                 ║
║  Run this file to add your photos to the website         ║
╚══════════════════════════════════════════════════════════╝
"""

import tkinter as tk
from tkinter import filedialog, messagebox
import shutil, os, sys
from PIL import Image

WEBSITE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Track which images are set ────────────────────────────
images = {
    "logo":       {"file": "logo.png",      "set": False, "label": None},
    "academy":    {"file": "academy.jpg",   "set": False, "label": None},
    "gallery2":   {"file": "gallery2.jpg",  "set": False, "label": None},
    "gallery3":   {"file": "gallery3.jpg",  "set": False, "label": None},
    "gallery4":   {"file": "gallery4.jpg",  "set": False, "label": None},
    "gallery5":   {"file": "gallery5.jpg",  "set": False, "label": None},
    "achieve1":   {"file": "achieve1.jpg",  "set": False, "label": None},
    "achieve2":   {"file": "achieve2.jpg",  "set": False, "label": None},
    "achieve3":   {"file": "achieve3.jpg",  "set": False, "label": None},
    "achieve4":   {"file": "achieve4.jpg",  "set": False, "label": None},
}

def pick_image(key, btn):
    path = filedialog.askopenfilename(
        title=f"Select image for: {key}",
        filetypes=[("Image files", "*.jpg *.jpeg *.png *.webp *.bmp"), ("All files", "*.*")]
    )
    if not path:
        return
    target = os.path.join(WEBSITE_DIR, images[key]["file"])
    try:
        # Convert & save using Pillow for best compatibility
        img = Image.open(path)
        if images[key]["file"].endswith(".png"):
            img.save(target, "PNG")
        else:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(target, "JPEG", quality=92)
        images[key]["set"] = True
        btn.config(bg="#25a244", fg="white", text=f"✅  {os.path.basename(path)}")
        if images[key]["label"]:
            images[key]["label"].config(fg="#25a244", text="✅ Added!")
        check_all_done()
    except Exception as e:
        messagebox.showerror("Error", f"Could not process image:\n{e}")

def check_all_done():
    done = sum(1 for v in images.values() if v["set"])
    status_label.config(text=f"Images added: {done} / {len(images)}")
    if images["logo"]["set"] and images["academy"]["set"]:
        done_btn.config(state="normal", bg="#3d5a2a", fg="white")

def finish():
    set_count = sum(1 for v in images.values() if v["set"])
    messagebox.showinfo(
        "✅ Done!",
        f"{set_count} image(s) added to your website folder!\n\n"
        "Now open index.html in your browser\n"
        "or run: node server.js\n\n"
        "Your images are live on the website! 🎯"
    )
    root.destroy()

# ══════════════════════════════════════════════════════════
#  BUILD THE GUI
# ══════════════════════════════════════════════════════════
root = tk.Tk()
root.title("AGSR Sonipat — Add Images to Website")
root.geometry("620x720")
root.configure(bg="#0d0d0d")
root.resizable(False, False)

# ── Header ────────────────────────────────────────────────
header = tk.Frame(root, bg="#2a3f1c", pady=16)
header.pack(fill="x")
tk.Label(header, text="🎯  AGSR SONIPAT", font=("Arial", 18, "bold"),
         bg="#2a3f1c", fg="#f5c518").pack()
tk.Label(header, text="Image Setup Tool — Click each button to pick your photo",
         font=("Arial", 10), bg="#2a3f1c", fg="#aaaaaa").pack()

# ── Scroll Frame ──────────────────────────────────────────
canvas = tk.Canvas(root, bg="#0d0d0d", highlightthickness=0)
scrollbar = tk.Scrollbar(root, orient="vertical", command=canvas.yview)
scroll_frame = tk.Frame(canvas, bg="#0d0d0d")
scroll_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
canvas.configure(yscrollcommand=scrollbar.set)
canvas.pack(side="left", fill="both", expand=True, padx=12, pady=12)
scrollbar.pack(side="right", fill="y")

def make_section(parent, title):
    f = tk.Frame(parent, bg="#1c1c1c", bd=0, relief="flat", pady=8)
    f.pack(fill="x", pady=(0, 6))
    tk.Label(f, text=title, font=("Arial", 11, "bold"),
             bg="#1c1c1c", fg="#f5c518", padx=12).pack(anchor="w")
    return f

def make_row(parent, key, label_text, required=False):
    row = tk.Frame(parent, bg="#1c1c1c", padx=12, pady=4)
    row.pack(fill="x")
    req = " *" if required else ""
    tk.Label(row, text=f"{label_text}{req}", font=("Arial", 9),
             bg="#1c1c1c", fg="#cccccc", width=32, anchor="w").pack(side="left")
    status_lbl = tk.Label(row, text="Not added", font=("Arial", 8),
                           bg="#1c1c1c", fg="#666666", width=10)
    status_lbl.pack(side="right", padx=(4, 0))
    images[key]["label"] = status_lbl
    btn_color = "#e63322" if required else "#333333"
    btn = tk.Button(row, text="📁 Pick Image",
                    font=("Arial", 9, "bold"), bg=btn_color, fg="white",
                    activebackground="#555", activeforeground="white",
                    bd=0, padx=12, pady=4, cursor="hand2",
                    command=lambda k=key, b=None: pick_image(k, b))
    btn.config(command=lambda k=key, b=btn: pick_image(k, b))
    btn.pack(side="right")

# ── REQUIRED SECTION ──────────────────────────────────────
req_section = make_section(scroll_frame, "⭐ REQUIRED — Main Images")
tk.Label(req_section, text="These 2 images are essential for the website.",
         font=("Arial", 8), bg="#1c1c1c", fg="#888888", padx=12).pack(anchor="w")
make_row(req_section, "logo",    "Academy Logo (circular AGSR logo)", required=True)
make_row(req_section, "academy", "Shooting Range Interior Photo",      required=True)

# ── GALLERY SECTION ───────────────────────────────────────
gal_section = make_section(scroll_frame, "🖼️  GALLERY — Extra Range / Academy Photos")
tk.Label(gal_section, text="Add more photos of your range, equipment, training sessions.",
         font=("Arial", 8), bg="#1c1c1c", fg="#888888", padx=12).pack(anchor="w")
make_row(gal_section, "gallery2", "Gallery Photo 2")
make_row(gal_section, "gallery3", "Gallery Photo 3")
make_row(gal_section, "gallery4", "Gallery Photo 4")
make_row(gal_section, "gallery5", "Gallery Photo 5")

# ── ACHIEVEMENTS SECTION ──────────────────────────────────
ach_section = make_section(scroll_frame, "🏆  ACHIEVEMENTS — Medals & Competition Photos")
tk.Label(ach_section, text="Add photos of your students' medals, trophies, certificates.",
         font=("Arial", 8), bg="#1c1c1c", fg="#888888", padx=12).pack(anchor="w")
make_row(ach_section, "achieve1", "Achievement Photo 1")
make_row(ach_section, "achieve2", "Achievement Photo 2")
make_row(ach_section, "achieve3", "Achievement Photo 3")
make_row(ach_section, "achieve4", "Achievement Photo 4")

# ── BOTTOM BAR ────────────────────────────────────────────
bottom = tk.Frame(root, bg="#141414", pady=10)
bottom.pack(fill="x", side="bottom")

status_label = tk.Label(bottom, text="Images added: 0 / 10",
                         font=("Arial", 9), bg="#141414", fg="#888888")
status_label.pack()

done_btn = tk.Button(bottom, text="✅  I'm Done — Open My Website",
                     font=("Arial", 11, "bold"), bg="#444", fg="#888",
                     activebackground="#4a7a30", activeforeground="white",
                     bd=0, padx=24, pady=10, cursor="hand2",
                     state="disabled", command=finish)
done_btn.pack(pady=6)
tk.Label(bottom, text="You can close this anytime — images are saved automatically.",
         font=("Arial", 8), bg="#141414", fg="#555").pack()

# Check if Pillow is installed
try:
    from PIL import Image
except ImportError:
    messagebox.showwarning(
        "One-time Setup Needed",
        "Installing Pillow (image library)...\nThis takes 10 seconds and happens only once."
    )
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "--break-system-packages", "-q"])
    from PIL import Image
    messagebox.showinfo("Ready!", "Setup complete! You can now add your images.")

root.mainloop()
