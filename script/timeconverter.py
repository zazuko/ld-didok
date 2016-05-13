# -*- coding: <utf-8> -*-
#run in python 3.x
import csv
import sys
import os

#configure which columns the times you want to convert are in
columnsToConvert  = ['parkrail_pflichtig_zeit1', 'parkrail_pflichtig_zeit2', 'parkrail_pflichtig_zeit3']

#assumes times are given in one of the following formats:
#`` (no time)
#`-` (no time)
#`hh.mm . hh.mm`
#`hh:mm . hh:mm`
#`hh.mm - hh.mm`
#`hh.mm - hh.mm`
#will convert time to the following format:
#`Mo,Tu,We,Th,Fr,Sa,Su hh:mm-hh:mm`
def convertTime(field):
	if len(field) >= 11:
		if '-' not in field:
			times = field.split(' . ')
		else:
			times = field.split(' - ')
		times[:] = [x.strip() for x in times]
		times[:] = [x.replace(".", ":") for x in times]
		corr = "Mo,Tu,We,Th,Fr,Sa,Su " + times[0] + "-" + times[1]
		field = corr
	return field

path = sys.argv[1]

print("Columns to convert: " + str(columnsToConvert))
print("loading file " + path + " ...")

with open(path, mode='r') as infile:
	reader = csv.reader(infile)

	lines = [l for l in reader]
	firstLine = lines[0]
	columnsToConvertIndicies = [firstLine.index(column) for column in columnsToConvert]

	f = 0
	linesX = []
	for line in lines:
		lineX = []
		for field in line:
			if line.index(field) in columnsToConvertIndicies and field not in columnsToConvert: #avoid trying to converting the first line
				field = convertTime(field)
				f+=1
			lineX.append(field)
		linesX.append(lineX)
	
	with open(path, mode='w', newline='') as outfile:
		writer = csv.writer(outfile)
		writer.writerows(linesX)
	print("Converted " + str(f) + " fields.")
	print("Written out to " + path)