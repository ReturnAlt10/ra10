import pypdf
import os

directory = r"c:\Users\mistr\Downloads\ra10\training-data\btec\level-2\it\unit-2"
for filename in os.listdir(directory):
    if filename.endswith(".pdf"):
        filepath = os.path.join(directory, filename)
        print(f"--- Document: {filename} ---")
        try:
            reader = pypdf.PdfReader(filepath)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    print(text)
        except Exception as e:
            print(f"Error reading {filename}: {e}")
        print("\n" + "="*50 + "\n")
