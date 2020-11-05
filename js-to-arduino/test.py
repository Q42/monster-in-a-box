import serial
import time

ser=serial.Serial("/dev/ttyUSB0",9600, timeout=1)  #change ACM number as found from ls /dev/tty/ACM*
ser.baudrate=9600

ser.flush()

# while True:
# time.sleep(2)
# ser.write(b"boot\n")
# line = ser.readline().decode('utf-8').rstrip()
# print(line)
# time.sleep(10)

# ser.write(b'boot;')

while True:
  read_ser=ser.readline()
  print(read_ser)