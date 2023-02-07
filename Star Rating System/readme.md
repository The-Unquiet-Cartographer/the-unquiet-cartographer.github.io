To use this system, do the following in your main .scss file:
Required:
    define $selectorPrefix (details below)
    @import _ratings.scss
Optional (recommended):
    @import _starCtnr.scss
Optional:
    @import _starCtnrBGColors.scss

Each star rating will use the following HTML code:
    <div class=parent-ctnr>
        <div class=star-ctnr>
            <div class=img-ctnr>
                <img src="IMGs/star-filled.png"/>
                <img src="IMGs/star-halfInner.png">
                <img src="IMGs/star-inner.png"/>
            </div>
            <div class=img-ctnr>
                <img src="IMGs/star-filled.png"/>
                <img src="IMGs/star-halfInner.png">
                <img src="IMGs/star-inner.png"/>
            </div>
            <div class=img-ctnr>
                <img src="IMGs/star-filled.png"/>
                <img src="IMGs/star-halfInner.png">
                <img src="IMGs/star-inner.png"/>
            </div>
            <div class=img-ctnr>
                <img src="IMGs/star-filled.png"/>
                <img src="IMGs/star-halfInner.png">
                <img src="IMGs/star-inner.png"/>
            </div>
            <div class=img-ctnr>
                <img src="IMGs/star-filled.png"/>
                <img src="IMGs/star-halfInner.png">
                <img src="IMGs/star-inner.png"/>
            </div>
        </div>
    </div>



Each .star-ctnr is related to a controlling element with a class from .r-1 to .r-10.

The controlling element can be the same element as the parent container, or it can be a different element.

The relationship between the controlling element and the star container is defined by $selectorPrefix.

Nesting the .star-ctnr inside a parent container is required, but you are free to define the parent container any way you like. The .parent-ctnr class I've used here is for illustrative purposes only.



$selectorPrefix examples:

    $selectorPrefix: "$";                   The .star-ctnr element is nested within the controlling element.
        HTML:
            <div class="parent-ctnr r-10">
                <h4>Some Rating Category</h4>
                <div class=star-ctnr>
                ...
                </div>
            </div>        
    $selectorPrefix: "&+*;                  The .star-ctnr element is directly adjacent to the controlling element.
        HTML:
            <span class=".controllingElement r-10"></span>
            <div class=parent-ctnr>
                <h4>Some Rating Category</h4>
                <div class=star-ctnr>
                ...
                </div>
            </div>
    $selectorPrefix: "&+*+*+*"            By chaining selectors together, you could have multiple controllers followed by multiple star containers.
        HTML:
            <span class=".Category1 r-10"></span>
            <span class=".Category2 r-9"></span>
            <span class=".Category3 r-8"></span>
            <div class=parent-ctnr>
                <div class=star-ctnr>
                    ...
                </div>
            </div>
            <div class=parent-ctnr>
                <div class=star-ctnr>
                    ...
                </div>
            </div>
            <div class=parent-ctnr>
                <div class=star-ctnr>
                    ...
                </div>
            </div>
 