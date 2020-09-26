module RakeHelpers
  # Helpers for Rake tests

  # Runs the provided rake task.
  # @name [String] Name of the task to run, including namespace, e.g. "db:seed"
  def self.run_task(name)
    Rake::Task[name].invoke
    # Because 'invoke' only executes a task once, subsequent calls to invoke for
    # the same task do nothing. This is undesirable for testing, so we manually
    # re-enable a task after invoking it.
    Rake::Task[name].reenable
  end
end
