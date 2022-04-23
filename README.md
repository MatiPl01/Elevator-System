# Elevator System

## How to start the app?
See the steps you need to follow to run the application:
[How to run the app](/project)

## Description
### Introduction
The purpose of this application is to simulate the functioning of the elevator system. To optimize the method of accepting requests to the elevator and assigning requests to elevators, the algorithm calculates the ETD (Estimated Time to Destination) after each request and finds the elevator which seems to handle the call in the shortest time. As a consequence, there is a possibility that the algorithm will insert the new stop between stops that were scheduled before, which will result in a longer waiting time for other passengers (the algorithm will minimize this time). 

### How is total time calculated?
The total time increased by adding the new route to the elevator routes is the sum of:
- time which the new passenger is supposed to wait for the elevator to come,
- elevator stop duration (opening the door, passenger entering the elevator, closing the door),
- time required to reach the new passenger's destination,
- time of each stop added to the elevator's route multiplied by the number of passengers traveling inside the elevator or entering the elevator after that stop (in other words, the algorithm calculates the sum of delays caused by the new passenger for all passengers that called the elevator before the new request)

### How passengers call the elevator?
To call the elevator, the passenger must enter the target floor using one of the button panels located on each floor. Button panels are not assigned to a specific elevator.  Instead, the elevator is selected based on the lowest ETD increase of all passengers. After the elevator call, passengers will be notified to which elevator they have been assigned (this functionality is not implemented - the new route will only appear in the details panel).

## Preview
### Overview
![Overview](/docs/overview.gif)

### General Settings
- pause / resume simulation,
- change time ratio (speed of animations),
- adjust scale of the elevators container,

![General Settings](/docs/settings.gif)

### Elevator Settings
You can modify elevator's parameters that are listed below:
- Min floor - the number of the lowest floor reached by the elevator,
- Max floor - the number of the highest floor reached by the elevator,
- Idle floor - the number of floor at which the elevator waits in the idle mode,
- Speed - the velocity of the elevator [m/s],
- Stop duration - time the elevator waits for passengers to enter,
- Toggle door duration - time required to open/close the elevator door

![Elevator Settings](/docs/elevator-settings.gif)

### Floors Settings
- Min floor - the number of the lowest floor in the building,
- Max floor - the number of the highest floor in the building
- Height (adjusted for each floor separately) - the height of the floor,

![Floors Settings](/docs/floors-settings.gif)

### Configuration
Example usage of the application displaying how to add/remove elevators, add/remove floors and adjust their properties.

![Configuration](/docs/configuration.gif)
