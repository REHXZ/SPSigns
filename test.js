// Step 1: Create a segmenter instance with the desired locale and granularity
const segmenter = new Intl.Segmenter('en', { granularity: 'word' });

// Step 2: Define the string to be segmented
const stringToSegment = "Hello world! This is a test.";

// Step 3: Use the segment() method to get an iterator for the segments
const segments = segmenter.segment(stringToSegment);

// Step 4: Iterate through the segments and log them
for (const segment of segments) {
    console.log(segment.segment);
}

// Output:
// Hello
//  
// world
// !
//  
// This
//  
// is
//  
// a
//  
// test
// .
