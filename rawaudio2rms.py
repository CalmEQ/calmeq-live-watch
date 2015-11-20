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
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
from socketIO_client import SocketIO, LoggingNamespace

#host='localhost'
host='calmeq-live-watch-alpharigel.c9.io'
#port=1324
port=8080
name='jessie.pi'

# connect to database
client = MongoClient()
db = client.calmeq_live_watch
noise = db.noisedata

with SocketIO(host, port, LoggingNamespace) as socketIO:
  socketIO.emit( 'add device', name );
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

    # send on socket.io
    socketIO.emit( 'signal', { 'name': name, 'key': "noiselvl", 'val': db } )

    # save to DB
    newdata = { "noiselvl": db, "date": datetime.now() }
    newid = noise.insert_one(newdata).inserted_id;
    sys.stderr.write( 'saved to db with id %s' % ObjectId( newid ) )
    
    raw_audio = sys.stdin.read(NREAD)
    
