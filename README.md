# Pulse Frame Productions FastAPI Web Application

*Source code for [pulseframeproductions.com](pulseframeproductions.com)*

Repository for the FastAPI app for the WIP website of Pulse Frame Productions (my new photography/videography company/website; most of all, a portfolio)

## Description

This app utilizes [FastAPI](https://fastapi.tiangolo.com/) as the web framework for pulseframeproductions.com. To start with, it will serve my static HTML templates using the template/theme [Anita](https://themeforest.net/item/anita-photography-html-template/38873822). It's a photography template aimed not only at photography but *videography* as well; it features a brilliant use of WebGL to showcase self-hosted videos at blazing speed and impeccable quality that I want prominently displayed in my portfolio.

### Relation to Personal site ([samuelharrison.net](samuelharrison.net))

As I've begun to update/rework my resume and cover letter(s), I realized my site should not be an extension of describing/showing my engineering skillset & experience. So instead of buildiing out and including my photography and videography portfolio on the same website, I realized since I'm establishing a new site & domain (company too) for photography/videography *already*, I could hit two birds with one stone. Develop a new [samuelharrison.net](samuelharrison.net) personal site portfolio in conjunction with this brand new site as I'd be creating the same thing.

So not only should/will the general theme, color palette, and UI+UX match [samuelharrison.net](samuelharrison.net), but it will be prominently displayed and significantly encouraged for the user to view.

An additional idea I had that is the perfect starting point/inspiration for my first [twine]() game, is that when a users clicks on whichever hyperlink I have on [samuelharrison.net](samuelharrison.net) that points to [pulseframeproductions.com](pulseframeproductions.com) (this site), they will see that it's ***"gamewalled"*** (I just came up with this term and I love it; a play on paywall).

To gain access to the photo/video portfolio they have to play a choose your own adventure browser-based (Twine is awesome for this) text adventure game! *(There will and definitely should be a prominent "Skip the game and take me to the portfolio")*. 

This game will showcase my game dev/industry experience through an actual playable game that is directly tied into my "portfolio(s)".

> Note: This is also a great way to mention multiple times throughout my engineering/dev experience personal site portfolio "resume/skillset" page that there is a "hidden" game I made *specifically* for this website and to find it, "you just need to click the **here** or the prominent fancy (we should color this differently or make it stand out, like "this is a special area of the site/special area of my portfolio/skillset/resume") link in the header titled 'PulseFrameProductions/Videography & Photography portfolio"

So far the working title is *"The Haunted Cinema"*.

## Requirements

* Python 3.8+ *(Currently being developed on latest, 3.11.8. No idea if >3.11.8 is supported/will run out of the box)*
* Poetry
* Postgresql
* Docker/Docker Compse

Kind of a requirement, but should install when installing project:

* FastAPI
  * [Starlette](https://www.starlette.io/) for web parts  (lightweight asgi framework)
  * [Pydantic](https://docs.pydantic.dev/latest/) for data parts

## Getting started

The following are instructions on how to install, run, and deploy this project.

### Running (local, without Docker)

1. Clone repo and cd into project `git clone git@github.com:limsammy/pulseframeproductions.com.git && cd pulseframeproductiojns.com`
2. Create and activate new python virtual environment (Optional, highly recommended. I am using pyenv so instruction will assume same setup) `pyenv virtualenv pulseframeproductions.com && pyenv activate pulseframeproductions.com`
3. Install all python dependencies with poetry `poetry <TODO: ADD CORRECT POETRY COMMAND HERE>`
4. Idk yet, still WIP. *TODO: Work on and finish readme*