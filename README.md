# week-visualizer
A site to plan the best time based around everyone's schedules.

http://www.vankessel.ca/week-visualizer/

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
