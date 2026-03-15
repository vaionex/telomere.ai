#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Write;

fn main() {
    // Catch both panics and errors — windows_subsystem = "windows" hides all output
    let result = std::panic::catch_unwind(|| {
        telomere_ai_lib::run()
    });

    let error_msg = match result {
        Ok(Ok(())) => return, // clean exit
        Ok(Err(e)) => format!("Runtime error: {}", e),
        Err(e) => {
            if let Some(s) = e.downcast_ref::<&str>() {
                format!("Panic: {}", s)
            } else if let Some(s) = e.downcast_ref::<String>() {
                format!("Panic: {}", s)
            } else {
                "Unknown panic".to_string()
            }
        }
    };

    // Write crash log
    let log_path = home_dir().join("telomere-ai-crash.log");
    if let Ok(mut f) = std::fs::File::create(&log_path) {
        let _ = writeln!(f, "Telomere AI crashed");
        let _ = writeln!(f, "{}", error_msg);
    }

    // Show error dialog on Windows
    #[cfg(target_os = "windows")]
    {
        use std::ffi::CString;
        let text = CString::new(format!(
            "Telomere AI failed to start:\n\n{}\n\nCrash log: {}",
            error_msg,
            log_path.display()
        )).unwrap_or_default();
        let title = CString::new("Telomere AI Error").unwrap_or_default();
        unsafe {
            extern "system" {
                fn MessageBoxA(hwnd: *mut std::ffi::c_void, text: *const i8, caption: *const i8, utype: u32) -> i32;
            }
            MessageBoxA(std::ptr::null_mut(), text.as_ptr(), title.as_ptr(), 0x10);
        }
    }

    // Print to stderr for Linux/macOS
    eprintln!("Telomere AI: {}", error_msg);
    std::process::exit(1);
}

fn home_dir() -> std::path::PathBuf {
    std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|_| std::env::temp_dir())
}
