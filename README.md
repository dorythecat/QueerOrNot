# Queer or Not
Queer or Not is a simple web game, where you'll be paired with a random stranger, and both of you will have one minute of text conversation, to try and guess whether the other person is queer or not. This program was developed for Summer of Making 2025, a program organized by the awesome folk at Hack Club. I also have taken very obvious inspiration from [Human or Not](https://humanornot.ai/), a game that pairs you with a random stranger and asks you to guess whether they are human or an AI model faking being a human.

# Why?
A friend of mine once said that the internet was the place where everyone let their rue colors shine. As humans, we lose our social inhibitions when we ineract with others in the internet, and, without purposeful intent, we often become an almost comically exagerated version of ourselves. This is especially true for queer people, who often feel more comfortable expressing themselves online than in real life. I wanted to create a game that would allow people to explore this idea in a fun and lighthearted way.

I am also slighly curious about how easily and reliably queer people can be identified in the internet, and how much your own queerness can influence your perception of others. This game is a fun way to explore that idea, and I hope you enjoy playing it as much as I enjoyed making it! <3

# How to run
To run this web app, you will need Node.js and npm installed on your computer. Once you have those installed, you can clone this repository and run the following command in the terminal:

```
npm install
node index.js
```

After this, you'll be abe to acess the game at `http://localhost:3000`. You can also deploy this app to a cloud service, but I haven't personally tested that.

# Running as a service
Queer or Not includes a template for running the app as a service in Linux-based systems using systemd. To set this up, first, copy the `queerornot.service` file to `/etc/systemd/system`:

```cp extra/queerornot.service /etc/systemd/system/```

Then, edit the file with your favourite editor so that the `ExecOnce=/usr/bin/node /QueerOrNot/index.js` line points to the correct path of the `index.js` file in your cloned repository. After that, you can start the service with the command:

```sudo systemctl start queerornot```

You can also enable the service to start on boot with:

```sudo systemctl enable queerornot```

Remmeber that running this app as a service will put the server log and reports file on your system's `/` directory, so you might want to change the paths in the service file to point to a different directory if you don't want to clutter your root directory.

Obviously, some computer knowledge is vastly recommended to set this up, of course...
