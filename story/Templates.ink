=== knotName ===
This is the content of the knot.
-> END

//Stitch
= stitchName
This is the content of the stitch that should be embedded within a knot.
-> END

//Conditional Text
{yourVariable: This is written if yourVariable is true|Otherwise this is written}

//Conditional Block
{yourVariable:
    This is written if yourVariable is true.
  - else:
    Otherwise this is written.
}

//Create a VAR
VAR myNumber = 5

//Create a TEMP
TEMP myTemporaryValue = 5

//Modify a VAR
~ myNumber = myNumber + 1
