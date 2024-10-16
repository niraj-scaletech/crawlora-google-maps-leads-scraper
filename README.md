### Sample crawlora app

This is the sample crawlora app that is used to publish and update app for crawlora dashboard.



## documentation

[app publish documentation](https://apidoc.crawlora.com/operation/operation-applicationcontroller_create)

## Update

in case if you want to update an existing app add `app_id` in `crawlora.json`


```json
# crawlora.json
{
    "env":{
        "key":"value"
    },
    "entrypoint": "./.dist/index.js",
    "function": "default",
    "screenshot_files": ["./assets/screenshot_1.png", "./assets/screenshot_2.png", "./assets/screenshot_3.png", "./assets/screenshot_4.png"],
    "logo_file": "./assets/logo.png",
    "banner_file": "./assets/banner.png",
    "title": "Google Links searches app starter",
    "short_description": "Get google links quickly",
    "version":"1.0.0",
    "documentation_file": "./documentation.md",
    "input_file": "./input.json",
    "app_id": "3636e627-4e2c-4293-acb2-1c2e4d856b87"
}
````


image setup guidelines

1. banner: 16:9 ( 1280px to 860px)
2. logo: 1:1 ( 1000px to 1000px  )
3. screenshots ( min 3 ) ( 1280px to 860px) each


# steps after creating a new project

1. update `crawlora.json`
2. update `input.json` ( make sure you have enough and proper inputs )
3. update `documentation.json`
4. set the `CRAWLORA_AUTH_KEY` secret in the new github repo
5. you will always have this environment variable when running so not need to set up in `crawlora.json`


## Environment variables at the runtime

```bash
#Environment variables at the runtime

CRAWLORA_SEQUENCE_ID # the running sequence
CRAWLORA_AUTH_KEY # the user auth key

```

you can get this from node.js runtime like this

```typescript
process.env['CRAWLORA_SEQUENCE_ID'] // 3636e627-4e2c-4293-acb2-1c2e4d856b87
process.env['CRAWLORA_AUTH_KEY'] //3636e627-4e2c-4293-acb2-1c2e4d856b873636e627-4e2c-4293-acb2-1c2e4d856b873636e627-4e2c-4293-acb2-1c2e4d856b873636e627-4e2c-4293-acb2-1c2e4d856b873636e627-4e2c-4293-acb2-1c2e4d856b87
```