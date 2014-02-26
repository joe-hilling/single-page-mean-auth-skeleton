/**
 * Created by Joe Hilling on 18/01/14.
 */
require('blanket')({
    // Only files that match the pattern will be instrumented
    pattern: '/app/',
    "data-cover-never": "node_modules"
});