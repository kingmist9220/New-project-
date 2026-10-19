// Starter articles written in the wiki's lightweight markup (see client/src/wikitext.js).
export const seedArticles = [
  {
    title: 'Main Page',
    content: `Welcome to '''WikiNode''', the free encyclopedia that anyone can edit.

This is a small demonstration wiki built with [[React]] and [[Node.js]]. Every article can be edited, and every edit is kept in the article's history.

== Getting started ==
* Browse [[Special:AllPages|all articles]]
* See what changed in [[Special:RecentChanges|recent changes]]
* Read about the [[World Wide Web]] or the [[History of encyclopedias]]
* Create a new page by following a red link, such as [[Quantum computing]]

== Formatting help ==
Articles use a simple markup:
* Headings: == Heading == and === Subheading ===
* Bold: '''bold text''' and italics: ''italic text''
* Links: [[Article title]] or [[Article title|custom text]]
* External links: [https://example.com Example site]
* Lists: start a line with * for bullets or # for numbers`,
  },
  {
    title: 'React',
    content: `'''React''' is a free and open-source JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.

== Overview ==
React lets developers describe what the interface should look like for a given state, and it efficiently updates the page when that state changes. It is commonly paired with a server written in [[Node.js]].

== Key concepts ==
* '''Components''' – reusable pieces of UI written as functions
* '''Props''' – inputs passed from a parent component to a child
* '''State''' – data that changes over time and triggers re-rendering
* '''Hooks''' – functions such as useState and useEffect that add behaviour to components

== History ==
React was first deployed on Facebook's news feed in 2011 and released as open source in 2013.

== See also ==
* [[Node.js]]
* [[World Wide Web]]`,
  },
  {
    title: 'Node.js',
    content: `'''Node.js''' is a cross-platform, open-source JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

== Design ==
Node.js uses an event-driven, non-blocking I/O model, which makes it well suited to network applications such as web servers. Its package manager, npm, hosts one of the largest collections of open-source libraries in the world.

== History ==
Node.js was written by Ryan Dahl and first released in 2009.

== Uses ==
# Web servers and REST APIs
# Command-line tools
# Build tooling for front-end frameworks such as [[React]]

== External links ==
* [https://nodejs.org Official website]`,
  },
  {
    title: 'World Wide Web',
    content: `The '''World Wide Web''' (WWW), commonly known as the Web, is an information system that enables content sharing over the Internet.

== History ==
The Web was invented by Tim Berners-Lee at CERN in 1989. The first website went online in 1991.

== How it works ==
Web pages are written in HTML and linked together with ''hyperlinks''. A web browser requests pages from web servers, which may be written in languages and runtimes such as [[Node.js]].

== See also ==
* [[History of encyclopedias]]
* [[React]]`,
  },
  {
    title: 'History of encyclopedias',
    content: `'''Encyclopedias''' have existed for around 2,000 years and have evolved from handwritten works into online collaborative projects.

== Ancient and medieval works ==
One of the oldest surviving encyclopedic works is the ''Naturalis Historia'' by Pliny the Elder, written around AD 77.

== Printed encyclopedias ==
The ''Encyclopédie'' of Diderot and d'Alembert, published from 1751, was a landmark of the Enlightenment. The ''Encyclopædia Britannica'' was first published in Edinburgh in 1768.

== Online encyclopedias ==
With the arrival of the [[World Wide Web]], encyclopedias moved online. Wikis allowed anyone to contribute and edit articles, with every change recorded in a page history.`,
  },
];
