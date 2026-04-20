class Env {
  public static readonly DB_NAME =
    process.env.EXPO_PUBLIC_DB_NAME || "manga_tracker.db";
}

export default Env;
