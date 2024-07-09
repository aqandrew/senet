# Senet

Next.js implementation of Senet, an ancient Egyptian board game.

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About

Built for [LWJ x AWS Amplify Web Dev Challenge](https://www.learnwithjason.dev/blog/web-dev-challenge-giveaway-full-stack-amplify).

> The prompt: “build a retro games-themed web app using AWS Amplify”

One of the earliest games I remember playing is Pyramid: Challenge of the Pharaoh's Dream, released in 1996. It's an educational point-and-click game where you're sent back in time to ancient Egypt and tasked with building a pyramid for the pharaoh. In order to obtain the limestone for the pyramid, you have to beat a merchant in a game of [senet](https://en.wikipedia.org/wiki/Senet)--which is quite possibly one of the most retro games there is. Senet is one of the oldest known board games, dating back to over 4,000 years ago.

## Rules

The exact rules of senet have been lost to history. But sources like Pyramid have come up with their own interpretations of the rules. The rules in this version have been adapted from those found in Pyramid, as seen in 51:45-55:10 of [this playthrough video](https://www.youtube.com/watch?v=OqVGvAXXc3o&t=3105s). You can read them in the source code in `rules.ts`, or in the app by clicking the Rules button at the top right.

## Features

Currently only local multiplayer is supported. That is, two people take turns on a single computer. Styles/layout are desktop-only for now.

In the interest of time for the challenge, I left out implementation for these rules:

- moving backwards if there are no legal forward moves
- safe squares (26, 28, and 29)

Some more features I'd love to add in the future:

- mobile styles
- online multiplayer
- drag n' drop to move pieces
