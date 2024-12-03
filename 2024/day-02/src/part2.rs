// First attempt. Didn't work
//
// fn apply_problem_dampener(
//     x: i32,
//     z: Option<&i32>,
//     x_substitute: &mut Option<i32>,
//     skip_next_used: &mut bool,
// ) -> Option<bool> {
//     if *skip_next_used {
//         return Some(false);
//     }
//     if z.is_none() {
//         return Some(true);
//     }
//     *x_substitute = Some(x);
//     *skip_next_used = true;
//     None
// }

// fn between_1_and_3(x: i32, y: i32) -> bool {
//     let diff = y - x;
//     diff.abs() >= 1 && diff.abs() <= 3
// }

// fn is_safe(report: &&Vec<i32>) -> bool {
//     let mut increasing = None;
//     let mut x_substitute = None;
//     let mut skip_next_used = false;
//     for i in 0..report.len() - 1 {
//         let x = x_substitute.take().unwrap_or(report[i]);
//         let y = report[i + 1];
//         let z = report.get(i + 2);
//         let diff = y - x;
//         if !between_1_and_3(x, y) {
//             if let Some(result) =
//                 apply_problem_dampener(x, z, &mut x_substitute, &mut skip_next_used)
//             {
//                 return result;
//             }
//             continue;
//         }
//         let _increasing = diff > 0;
//         if increasing.is_none() {
//             increasing = Some(_increasing);
//         } else if increasing.unwrap() != _increasing {
//             if let Some(result) =
//                 apply_problem_dampener(x, z, &mut x_substitute, &mut skip_next_used)
//             {
//                 return result;
//             }
//         }
//     }
//     true
// }

fn between_1_and_3(x: i32, y: i32) -> bool {
    let diff = y - x;
    diff.abs() >= 1 && diff.abs() <= 3
}

fn is_safe(report: &&Vec<i32>) -> bool {
    let mut increasing = None;
    for i in 0..report.len() - 1 {
        let x = report[i];
        let y = report[i + 1];
        let diff = y - x;
        if !between_1_and_3(x, y) {
            return false;
        }
        let _increasing = diff > 0;
        if increasing.is_none() {
            increasing = Some(_increasing);
        } else if increasing.unwrap() != _increasing {
            return false;
        }
    }
    true
}

fn is_safe_with_problem_dampener_applied(report: &&Vec<i32>) -> bool {
    if is_safe(report) {
        return true;
    }
    for i in 0..report.len() {
        let mut perm = report.to_vec();
        perm.remove(i);
        if is_safe(&&perm) {
            return true;
        }
    }
    false
}

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let mut reports = vec![];
    for line in input.lines() {
        reports.push(
            line.split_whitespace()
                .map(|x| x.parse::<i32>().unwrap())
                .collect::<Vec<i32>>(),
        );
    }
    let safe_count = reports
        .iter()
        .filter(is_safe_with_problem_dampener_applied)
        .count();
    return Ok(safe_count.to_string());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "7 6 4 2 1
                           1 2 7 8 9
                           9 7 6 2 1
                           1 3 2 4 5
                           8 6 4 4 1
                           1 3 6 7 9";
        assert_eq!("4", process(input)?);
        Ok(())
    }
}
