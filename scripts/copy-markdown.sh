#!/bin/bash
set -e

files=$(find content -name "*.mdx")
output_dir="public"

for file in $files; do
	parent_folder=$(dirname "$file")
	parent_folder_without_content=${parent_folder//content\/posts\/}
	file_name=$(basename "$file")
	file_name_without_ext="${file_name%.*}"

	echo "Copying $file to $output_dir/$parent_folder_without_content/$file_name_without_ext.md"

	mkdir -p "$output_dir/$parent_folder_without_content"
	output_file_path="$output_dir/$parent_folder_without_content/$file_name_without_ext.md"
	cp "$file" "$output_file_path.tmp"

	sed -E 's|(../)*public/|/|g' "$output_file_path.tmp" > "$output_file_path"
	rm "$output_file_path.tmp"
done
