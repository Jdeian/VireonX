import { Button } from "@common/components/shadcn/button";

const PlatformSetup = ({
  selectedPlatforms,
  form,
  onConnectPlatform,
  onDisconnectPlatform,
}) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          Connect your selected platforms
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Only the platforms you selected in your preferences are
          shown here. You can connect them now or skip and do it
          later in Settings.
        </p>
      </div>

      <div className="grid gap-4">
        {selectedPlatforms.map((platform) => {
          const connected = form.connectedAccounts[platform.id];

          return (
            <div
              key={platform.id}
              className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${platform.color}`}
                  >
                    <platform.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{platform.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {connected
                        ? "Account connected successfully."
                        : "Connect this account to enable posting and scheduling."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                      connected
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {connected ? "Connected" : "Not Connected"}
                  </span>

                  <Button
                    type="button"
                    onClick={() =>
                      connected
                        ? onDisconnectPlatform(platform.id)
                        : onConnectPlatform(platform.id)
                    }
                    className={
                      connected
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }
                  >
                    {connected ? "Disconnect" : `Connect ${platform.name}`}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        In production, the connect buttons would redirect to your
        backend OAuth endpoints, then return the user to VireonX
        after authorization.
      </div>
    </div>
  );
}

export default PlatformSetup;