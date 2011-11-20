
!!A note on maven dependencies!!

All dependencies for this project should be available on standard maven repos, except GeoTools,
which has it's own repo urls in the POM.

The javascript-maven-plugin, which is used for building javascript is a bit of a pain in the ass.
The simplest solution to get this to work is by checking out the javascript-maven-tools (which the javascript-maven-plugin is part of), by issuing:

svn checkout http://svn.codehaus.org/mojo/trunk/sandbox/javascript-maven-tools/ javascript-maven-tools


and then install it to your local repo with

mvn clean install

in the javascript-maven-tools folder

Some tests may fail, the simplest soulution is then to comment out those assertions, this worked for me



