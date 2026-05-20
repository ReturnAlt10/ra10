import os
from pypdf import PdfReader

input_dir = r"C:\Users\mistr\Downloads\ra10\training-data\btec\level-2\it\unit-2"
output_file = os.path.join(input_dir, "extracted_content.txt")

pdf_files = [f for f in os.listdir(input_dir) if f.lower().endswith('.pdf')]
full_text = ""

for pdf_file in pdf_files:
    pdf_path = os.path.join(input_dir, pdf_file)
    print(f"Processing: {pdf_file}")
    full_text += f"\n\n--- Source: {pdf_file} ---\n\n"
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    except Exception as e:
        full_text += f"Error processing {pdf_file}: {e}\n"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(full_text)

print("\n--- EXTRACTED CONTENT START ---\n")
print(full_text)
print("\n--- EXTRACTED CONTENT END ---\n")
print(f"Extracted content saved to: {output_file}")
