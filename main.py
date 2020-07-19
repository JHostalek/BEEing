import machine

from ota_updater import OTAUpdater


def download_and_install_update_if_available():
    ota_updater = OTAUpdater('https://github.com/JHostalek/BEEing.git')
    ota_updater.download_and_install_update_if_available(':)', 'soulknight')


def start():
    from app import App
    app = App()
    app.run()
    machine.sleep(10000)
    download_and_install_update_if_available()


# your custom code goes here. Something like this: ...
# from main.x import YourProject
# project = YourProject()
# ...

def boot():
    download_and_install_update_if_available()
    start()


boot()
