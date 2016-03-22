jquery-plugin-template
======================

This is a template for jquery plugins. It contains nothing but the structure and helpful comments and should be a good start to build your own plugin.

The extended version contains additional helper functions which you may like.


TODO
--------
- modify auto pilot to use class selectors, since attribute selectors are much slower
- remove ajaxStop & DOMContentAdded EventListeners
- use MutationObersers to find newly added elements based upon initial selector
- Implement i18n with examples
- Build a factory version. Functions which are the same in all plugins can be moved there for inheritance. This will reduce the total amount of code.
