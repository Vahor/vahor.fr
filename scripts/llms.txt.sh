#!/bin/bash
set -e

domain="vahor.fr"
files=$(find public -name "*.md")
output_dir="public"

output_file_path="$output_dir/llms.txt"

echo "# vahor.fr posts" > "$output_file_path"
echo "" >> "$output_file_path"
echo "## Posts" >> "$output_file_path"

for file in $files; do
	title=$(cat "$file" | grep -oE "^title:.*$" | sed -E 's/title: *//g')
	file_without_public=${file//public\/}
	url="https://$domain/$file_without_public"
	echo "- [$title]($url)" >> "$output_file_path"
done

echo "llms.txt generated"
