<br>
<p align="center">
  <a href="https://github.com/jckli/Statsify">
    <img src="https://raw.githubusercontent.com/jckli/Statsify/v2/Statsify/static/imgs/logo.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Statsify</h3>

  <p align="center">
    A web app that allows you to view how many minutes you've spent listening to music on Spotify this year as well as other stats.
  </p>
</p>

<br>

> **Note**: Neither this application nor the logo is affiliated with Spotify. This application uses personal Spotify data, and though this application does not store any of your data, use at your own risk.

## Why?

Though Spotify Wrapped shows this information every year, I wanted to see whether or not I could find the information in a similar way without having to wait for the year to end.

Since this python script directly uses Spotify data retrieved from the user's account, it is very accurate, taking in exactly how many milliseconds listened per track instead of the full track length, displaying exactly how much time was spent listening this year.

## Usage & Pre-requisites

- Python 3.8
- tkinter

> **Note**: You will need to install these manually, this readme does not cover the installation of these dependancies.

You will also need to retrieve your data from Spotify. This can be done by going to the Spotify website, and then clicking on the "Privacy" tab in the account settings and then
requesting the data. After this is done, you will need to wait for a few days for them to send it to you.
