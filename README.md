# ACSL Practice Website

This is the website that allows CA students to train(and earn points!)

# File reference for newbies

1. .gitignore - folders/directories ignored by source control
2. package.json and package-lock.json - files that manage installed packages
3. postcss.config.cjs - config for the mantine styling library
4. .prettierrc and .prettierignore - config files for prettier(a code formatter)
5. vite.config.js - config for vite, which is responsible for local hosting and deployment

# More important information for newbies

1. memo(function) creates a react component that doesn't re-render unless any of its arguments changes.
   This is simply useful for improving application speed, but it doesnt apply in all cases.

## TODO

1. Finish Achievements
2. Add programming problem support - https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/ - Maybe? see if this is worth it
3. Add ability to clear topic score
