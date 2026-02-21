mod parser;
mod snp_database;
mod analyzer;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            parser::parse_genetic_file,
            analyzer::analyze_genetic_file,
            analyzer::get_snp_detail,
            analyzer::search_snps,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
