function doMinify() {
	files=$(find . -name $1\*.js)
	for f in $files
	do
		filename=${f%.*}

		if [[ "$f" != *min.js* ]]
		then
			echo "process $f";
			uglifyjs "$f" -c -o "$filename"_min.js
		fi
	done
}

doMinify ""
