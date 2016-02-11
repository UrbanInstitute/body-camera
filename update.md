##Updating main text

Updating the main feature text should be relatively straighforward, just edit index.html [starting at the `<!-- text -->` comment](index.html#L1932-L1967)

##Updating column headers

Depending on the header, it may need to be updated in a few different places. To be safe, cmd-f to find *all occurences* of the old header *both* in index.html and js/bodycam.js. For example, "Restricts recordings in private spaces" is found in three places, [here](index.html#L591), [here](js/bodycam.js#L103), and [here](js/bodycam.js#L426).

##Updating "info" text

The info text (hover on the "i" icon) is found in the same way as column headers (cmd-f to find all occurences in index.html AND js/bodycam.js). Just add to the column header:

- **In js/bodycam.js**: `<i class=\"fa fa-info-circle\" data-text=\"TEXT GOES HERE\"></i>` 

 *Examples can be found [here](js/bodycam.js#L441) and [here](js/bodycam.js#L411)*
 
- **In index.html**: `<i class="fa fa-info-circle" data-text="TEXT GOES HERE"></i>`
 
 *Examples can be found [here](index.html#L370) and [here](index.html#L814)*
 
 
##Chart updates
Margaret should be on top of updating the blurbs and chart, by editing [this google doc](https://docs.google.com/spreadsheets/d/15yXsR5uVKej8hobUdhBNzwazDZeF1JBF4IORk6eBQVQ/edit?usp=sharing)

##All other updates

Other text can be updated by cmd-f searching for the text. Most likely it is in [index.html](index.html), but may also be in [js/bodycam.js](js/bodycam.js). 
