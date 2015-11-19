#!/usr/bin/env python

# -*- coding: utf-8 -*-
"""
Created on Mon Apr 27 23:13:50 2015

@author: jdermody
"""


#%%
import sys
#import subprocess as sp
import numpy
from socketIO_client import SocketIO, LoggingNamespace

# hack for stdin
# remove this once finished downloading

with SocketIO('localhost', 1324, LoggingNamespace) as socketIO:
  NREAD=60000
  sys.stderr.write( 'starting read data in python\n' )
  raw_audio = sys.stdin.read(NREAD)
  while ( raw_audio ):
    audio_array = numpy.fromstring(raw_audio, dtype="int16")
    newarray = audio_array.astype("float") / (2**15)
    
    rms = numpy.sqrt(numpy.mean(newarray**2))
    
    dbfm = 20 * numpy.log10(rms)
    db = dbfm + 85
    
    #  sys.stdout.write( raw_audio )
    sys.stdout.write( '%g\n' % db )
    sys.stderr.write( 'got %g in python\n' %db )
    socketIO.emit( 'noiselvl', db )
  
    raw_audio = sys.stdin.read(NREAD)
