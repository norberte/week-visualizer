# week-visualizer
A site to plan the best time based around everyone's schedules.

https://ubco.github.io/week-visualizer/

# Things to know
I realize that you guys may not actually be able to read my mind, so here are some things about the project you should know.

I'm using jQuery, it's a javascript framework. I imagine if you've used javascript before you know this but I shouldn't make assumptions. If the js looks weird to you, this is why. Read up on it, it's amazingly useful.

Imagine this is a 2d array of size 48x7 (Half hours by days), and selecting boxes fills them in with 1, 0, or -1. No matter how the visible size of the table changes on the website, the exported data will be of this size.

If my code, comments, or formatting suck and you can't tell what's going on, let me know. It would help me as much as you. Ask any questions about anything. I've never written code for others to read before, and I'm sure for some of you it's your first time having to interpret another's code. So if it's too confusing just message me or leave a comment on the facebook post.

# Project Outline
Plz keep in javascript and jquery.

# A) export  
   1) Table to int array (0 being nothing, 1 is free/blue(1), 2 being busy/red(-1))
  
   2) Array to string
# B) heatmap
   1)Calculate score//Sum of scores//Or how to not sort by average rating

# JQuery Tutorial - Getting started with jQuery
http://welovecoding.com/tutorials/javascript/getting-started-with-jquery/

# JQuery Documentation Here:
https://api.jquery.com/

# The next few steps:
1.	Decompress the output into 0s, 1s and 2s and put them back into the 2D array
2.	Count how many 0s, 1s and 2s are in each array created from multiple output strings
3.	Create the ratio (sum of friends available / total friends) for each half an hour  (Use how to not sort by average)
4.	Create the heat map schedule and get the hexadecimal shades of colours to represent the ratios (possibly between 0 and 1)
5.	 Troubleshoot
6.	Improve performance and efficiency
7.	Add new features

HTML page changes - We talked about making a radio-button control the interface, whether or not it shows the heat-map or the user’s schedule. The way it looked until now is the basic interface and when we will change it, we will remove all of the settings from the top left corner and add a text-area with a button that says add. This was we can add compressed codes into the system and the data represented by the code will be added into the heat-map by clicking Create Heatmap.

# Interesting article and video : http://www.bbc.com/news/science-environment-31450389
It is about Vint Cerf, Vice-Principle at Gooogle, "predicting" a future digital dark age... Someone post this on Facebook, to share it with the group
