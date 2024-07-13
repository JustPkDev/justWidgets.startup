
## Just Widgets (startup)
<p>A widgets app that runs when computer start and show widgets on desktop</p>

#### how to use it.
<p>Make widgets in html css and javascript in a folder and add a file "fileName.json"</p>


<pre>fileName.json
NOTE: add "folderName/index.html" in file tag.
<code>
{
    "x": 0,
    "y": 0,
    "width": 200,
    "height": 200,
    "movable": true,
    "resizable": false,
    "transparent": true,
    "file": "folder name/index.html"
}
</code></pre>

<p>add folder to widgets directory in app</p>
<pre><code>locals/
widgets/
justWidgets.startup.exe
other...
</code></pre>

<p>in widgets directory there is a file called "widgets.json". open and write your fileName.json path.</p>
<pre><code>NOTE: add "folderName/fileName.json".
[
    "folderName/fileName.json"
]
</code></pre>

<p>open the app or refresh on tray icon</p>

#### LICENSE MIT

<p>made by <a target="_blank" 
href="https://justpkdev.web.app">justpkdev</a></p>

