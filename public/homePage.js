"use strict";
const logButton = new LogoutButton();
logButton.action = function () {
    ApiConnector.logout(function (response) {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current(function (response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const board = new RatesBoard();

function exchangeRate() {
    ApiConnector.getStocks(function (response) {
        if (response.success) {
            board.clearTable(response);
            board.fillTable(response.data);
        }
    });
}

exchangeRate();
setInterval(exchangeRate, 60000);

const moneyManager = new MoneyManager();

function messageManager(response) {
    moneyManager.setMessage(!response.success, !response.success ? response.data : 'Операция проведена успешно!');
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
}

moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, function (response) {
        messageManager(response);
    })
};

moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, function (response) {
        messageManager(response);
    })
};

moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, function (response) {
        messageManager(response);
    })
};

const favorite = new FavoritesWidget();

function updateUsers(response) {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
}

ApiConnector.getFavorites(function (response) {
    updateUsers(response);
});


favorite.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, function (response) {
        favorite.setMessage(!response.success, !response.success ? response.data : `${data.name} добавлен успешно`);
        updateUsers(response);
    })
};

favorite.removeUserCallback = function (data) {
    ApiConnector.removeUserFromFavorites(data, function (response) {
        favorite.setMessage(!response.success, !response.success ? response.data : `Пользователь с id ${data} удалён`);
        updateUsers(response);
    })
};

