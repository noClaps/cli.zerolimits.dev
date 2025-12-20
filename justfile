build:
    @monopack src/index.html
    @cp -r public/** dist

serve:
    @watchexec --clear --restart --ignore dist 'just build && serve dist'
