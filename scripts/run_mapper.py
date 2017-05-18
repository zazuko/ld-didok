import time
import subprocess
import os

def cleanFolder():
	print('Deleting old files in the `target` directory...')
	for f in os.listdir('target'):
		try:
			print('...' + f)
			os.remove('target/' + f)
		except:
			print('[WARN]: failed to remove `' + f + '`')
			pass
	print('Done.')

def convertFiles():
	#specify which .ttl files in the config you want to convert
	files = ['didok', 'gepaeck', 'mobility', 'nebenbetriebe', 'service']

	#devnull device to suppress the output
	devnull = open(os.devnull, 'w')
	print('Converting files (this may take while (30-ish seconds if you\'re not running a potato))')
	for file in files:
		print('converting ' + file + '...')
		start = time.time()
		subprocess.call([	'java',
							'-jar',
							'../RML-Mapper-1.0.0.jar',
							'-m',
							'config/' + file + '.ttl',
							'-o',
							'target/' + file + '.nt',
							'-f',
							'ntriple'], stdout=devnull, stderr=devnull) # suppress output
		end = time.time()
		print('Done. Converting took ' + str(end - start) + 's')


cleanFolder()
convertFiles()
