# Statsify Rework (v3)

> **todo:** make this look nicer

this is a rework of the original statsify website. the original website is made fully with flask, and uses jinja and flask's templating system to render the frontend. **this is a HORRIBLE system**. it's slow, it's ugly, and it's not very maintainable. i made it before i knew much about coding, and now i know that not seperating the frontend and backend is shit.

this new rework uses next.js as the frontend, in combination with the sanic python framework as the backend. its _much, much_ faster and actually readable LMAO.
