import sys
githash = sys.argv[1]
with open('./dist/index.html', "r") as f:
    archivo = f.read()
archivo = archivo.replace('.js"', '.js?gzip"')
archivo = archivo.replace('loader.js?gzip"', 'loader.js"')
archivo = archivo.replace('.css"', '.css?gzip"')
archivo = archivo.replace('versiongithash', githash)
print "este es archivo", archivo


with open('./dist/index.html', "w") as f:
    f.write(archivo)
