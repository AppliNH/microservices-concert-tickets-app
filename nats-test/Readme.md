# NATS Streaming server

A message / event bus

## Monitoring

At http://localhost:8222/streaming.

See subscribers list and details for channels : http://localhost:8222/streaming/channelsz?subs=1

## Queue groups

Queue groups are made so several instances of a listener don't receive several times the same message / event.

In short, if you have two instances of one listener "A", and if you set up a queue group, the message / event will go to one instance and not the other one.

This is really useful, because it allow to get rid off event duplication for a same listener, which would have conducted to a double-processing.

Ex : on event received, the listener/app push to db. With 2 instances of your listener, it would push twice to db.

## Args

`hb` (for hardbit) is basically an healthcheck.

- `hbi` : how often a healthcheck request is made to client by NATS SS
- `hbt` : how long each client has to respond
- `hbf` : number of times each client can fail before NATS SS assumes that the connection is dead and gone

