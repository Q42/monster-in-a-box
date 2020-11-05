import grovepi
print(grovepi.version())

import time

# Connect the Grove PIR Motion Sensor to digital port D8
# NOTE: Some PIR sensors come with the SIG line connected to the yellow wire and some with the SIG line connected to the white wire.
# If the example does not work on the first run, try changing the pin number
# For example, for port D8, if pin 8 does not work below, change it to pin 7, since each port has 2 digital pins.
# For port 4, this would pin 3 and 4

pir_sensor = 4
motion=0
grovepi.pinMode(pir_sensor,"INPUT")

while True:
	try:
		# Sense motion, usually human, within the target range
		motion=grovepi.digitalRead(pir_sensor)
		if motion==0 or motion==1:	# check if reads were 0 or 1 it can be 255 also because of IO Errors so remove those values
			if motion==1:
				print ('Motion Detected')
			else:
				print ('-')

			# if your hold time is less than this, you might not see as many detections
		time.sleep(.2)

	except IOError:
		print ("Error")