// Copyright 2018 Bartosz Jaroszewski
// SPDX-License-Identifier: GPL-2.0-or-later
// (see extension.js for details)

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings.Settings;


class SettingsBuilder {
    constructor() {
        this._settings = new Settings().settings;
        this._builder = new Gtk.Builder();
    }

    build() {
        this._builder.add_from_file(Me.path + '/Settings.ui');
        // this._settingsBox = this._builder.get_object('bluetooth_quick_connect_settings');

        this._widget = this._builder.get_object('items_container')

        this._builder.get_object('auto_power_off_settings_button').connect('clicked', () => {
            console.log(this)
            let dialog = new Gtk.Dialog({
                title: 'Auto power off settings',
                transient_for: this._widget.get_toplevel(),
                use_header_bar: true,
                modal: true
            });


            let box = this._builder.get_object('auto_power_off_settings');
            dialog.get_content_area().add(box);

            dialog.connect('response', (dialog) => {
                dialog.get_content_area().remove(box);
                dialog.destroy();
            });

            // if (dialog.show_all)
                dialog.show_all();
        });


        this._bind();

        return this._widget;
    }

    _bind() {
        let autoPowerOnSwitch = this._builder.get_object('auto_power_on_switch');
        this._settings.bind('bluetooth-auto-power-on', autoPowerOnSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

        let autoPowerOffSwitch = this._builder.get_object('auto_power_off_switch');
        this._settings.bind('bluetooth-auto-power-off', autoPowerOffSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

        let autoPowerOffInterval = this._builder.get_object('auto_power_off_interval');
        this._settings.bind('bluetooth-auto-power-off-interval', autoPowerOffInterval, 'value', Gio.SettingsBindFlags.DEFAULT);

        let keepMenuOnToggleSwitch = this._builder.get_object('keep_menu_on_toggle');
        this._settings.bind('keep-menu-on-toggle', keepMenuOnToggleSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

        let refreshButtonOnSwitch = this._builder.get_object('refresh_button_on');
        this._settings.bind('refresh-button-on', refreshButtonOnSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);

        let debugModeOnSwitch = this._builder.get_object('debug_mode_on');
        this._settings.bind('debug-mode-on', debugModeOnSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);
    }

}

function init() {
}

function buildPrefsWidget() {
    let settings = new SettingsBuilder();
    let widget = settings.build();

    if (widget.show_all)
        widget.show_all();

    return widget;
}
