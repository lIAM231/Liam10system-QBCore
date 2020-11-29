QBCore = nil

TriggerEvent('QBCore:GetObject', function(obj) QBCore = obj end)

local CallSigns = {}

local duty = false

RegisterServerEvent("10system:action")
AddEventHandler("10system:action", function(data)
    if data.action == "error" then
        TriggerEvent('10system:sendError', data.code)
    end
end)

RegisterServerEvent("10system:add")
AddEventHandler("10system:add", function()
    local data = {}

    for k,v in pairs(QBCore.Functions.GetPlayers()) do
        local xPlayer = QBCore.Functions.GetPlayer(v)
        if xPlayer.PlayerData.job.name == Config.PoliceJob and xPlayer.PlayerData.job.onduty then
            local name = xPlayer.PlayerData.charinfo.firstname .. " " .. xPlayer.PlayerData.charinfo.lastname
            local rank = xPlayer.PlayerData.job.label
            local callSign = CallSigns[xPlayer.PlayerData.citizenid] or "לא מוגדר"
            table.insert(data, {
                src = source,
                callsign = callSign,
                name = name,
                rank = rank,
                duty = true
            })
        elseif xPlayer.PlayerData.job.name == Config.PoliceJob and not xPlayer.PlayerData.job.onduty then
            local name = xPlayer.PlayerData.charinfo.firstname .. " " .. xPlayer.PlayerData.charinfo.lastname
            local rank = xPlayer.PlayerData.job.label
            local callSign = CallSigns[xPlayer.PlayerData.citizenid] or "לא מוגדר"
            table.insert(data, {
                src = source,
                callsign = callSign,
                name = name,
                rank = rank,
                duty = false
            })
        end
    end

    TriggerClientEvent("10system:update", -1, data)
end)

RegisterServerEvent("10system:rank")
AddEventHandler("10system:rank", function(data)
    local xPlayer = QBCore.Functions.GetPlayer(source)
    CallSigns[xPlayer.PlayerData.citizenid] = data
    SaveResourceFile(GetCurrentResourceName(), "database.json", json.encode(CallSigns))
    TriggerEvent("10system:add")
end)

CreateThread(function()
    local result = json.decode(LoadResourceFile(GetCurrentResourceName(), "database.json"))

    if result then
        CallSigns = result
    end
end)